<?php

namespace Korah\CcRobot\Model\Config\Backend;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Config\Model\Config\Backend\Serialized\ArraySerialized;
use Korah\CcRobot\Helper\I18Helper;

class CcrStrings extends ArraySerialized
{
    protected $_helper;
    protected $_serializer;

    public function __construct(
        Json $serializer,
        I18Helper $i18Helper,
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\App\Config\ScopeConfigInterface $config,
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_helper = $i18Helper;
        $this->_serializer = $serializer;
        parent::__construct($context, $registry, $config, $cacheTypeList, $resource, $resourceCollection, $data);
    }
    
    public function beforeSave()
    {
        $value = $this->getValue();
        $data = $this->_helper->getResources();
        foreach($value as $rowId => $row)
        {
            $locale = preg_match('/:([^:]+)$/', $rowId, $matches) ? $matches[1] : "";
            if(!isset($data[$locale]))
            {
                $data[$locale] = [];
            }
            $data[$locale][$row["key"]] = $row["value"];
        }
        $this->_helper->save($data);
        $this->setValue($this->_serializer->serialize($value));
    }

    protected function _afterLoad()
    {
        $obj = array();
        $data = $this->_helper->getResources();
        $i = 0;
        foreach($data as $locale => $translation)
        {
            foreach($translation as $key => $value)
            {
                $obj["_$i:$locale"] = [
                    "key" => $key,
                    "value" => $value
                ];
                $i++;
            }    
        }
        $this->setValue($obj);
    }
}