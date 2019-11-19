<?php

namespace Korah\CcRobot\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Component\ComponentRegistrarInterface;
use Magento\Framework\Component\ComponentRegistrar;

class I18Helper extends AbstractHelper
{
    protected $_i18Path;
    protected $_moduleRoot;

    public function __construct(
        ComponentRegistrarInterface $componentRegistrar,
        Context $context
    )
    {
        $this->_moduleRoot = $componentRegistrar->getPath(ComponentRegistrar::MODULE, 'Korah_CcRobot');
        $this->_i18Path = "$this->_moduleRoot/view/frontend/web/js/i18Locale.js";
        parent::__construct($context);
    }

    public function getResources()
    {
        $contents = file_get_contents($this->_i18Path);
        $contents = preg_match('/^[^{]*(.+?);?\s*$/is', $contents, $match) ? json_decode($match[1], true) : $contents;
        foreach($contents as $locale => $translation)
        {
            $contents[$locale] = $translation["translation"];
        }
        return $contents;
    }

    public function save($data)
    {
        foreach($data as $locale => $translation)
        {
            $data[$locale] = [
                "translation" => $translation
            ];
        }
		$data = "var resourcesCustom = " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . ";";
		file_put_contents($this->_i18Path, $data);
    }

    public function getLabels()
    {
        $contents = $this->getResources();
        foreach($contents as $locale => $translation)
        {
            foreach($contents[$locale] as $key => $value)
            {
                $contents[$locale][$key] = $key;
            }
        }
        foreach(json_decode(file_get_contents("$this->_moduleRoot/Helper/labels.json"), true) as $locale => $labels)
        {
            if(isset($contents[$locale]))
            {
                foreach($labels as $key => $value)
                {
                    $contents[$locale][$key] = $value;
                }
            }
        }
        return $contents;
    }
}

?>